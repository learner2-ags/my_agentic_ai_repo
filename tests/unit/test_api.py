import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def setup_function():
    client.post("/lab/reset")


def test_service_root_exposes_systems_collection():
    response = client.get("/redfish/v1")
    assert response.status_code == 200
    assert response.json()["Systems"]["@odata.id"] == "/redfish/v1/Systems"


def test_get_system_returns_redfish_style_resource():
    response = client.get("/redfish/v1/Systems/1")
    assert response.status_code == 200
    body = response.json()
    assert body["Id"] == "1"
    assert body["Manufacturer"] == "HPE"
    assert body["PowerState"] == "On"
    reset_action = body["Actions"]["#ComputerSystem.Reset"]
    assert reset_action["target"] == "/redfish/v1/Systems/1/Actions/ComputerSystem.Reset"
    assert reset_action["ResetType@Redfish.AllowableValues"] == ["On", "ForceOff", "GracefulRestart"]


@pytest.mark.parametrize(
    ("reset_type", "expected_power_state"),
    [("On", "On"), ("ForceOff", "Off"), ("GracefulRestart", "On")],
)
def test_computer_system_reset_updates_state(reset_type, expected_power_state):
    response = client.post(
        "/redfish/v1/Systems/1/Actions/ComputerSystem.Reset",
        json={"ResetType": reset_type},
    )

    assert response.status_code == 204
    assert response.content == b""
    system = client.get("/redfish/v1/Systems/1").json()
    assert system["PowerState"] == expected_power_state
    assert system["Oem"]["Hpe"]["LastResetType"] == reset_type


def test_computer_system_reset_rejects_unsupported_type_without_mutation():
    response = client.post(
        "/redfish/v1/Systems/1/Actions/ComputerSystem.Reset",
        json={"ResetType": "InvalidResetType"},
    )

    assert response.status_code == 400
    extended_info = response.json()["error"]["@Message.ExtendedInfo"][0]
    assert extended_info["MessageId"] == "Base.1.0.PropertyValueNotInList"
    assert extended_info["MessageArgs"] == ["ResetType", "InvalidResetType"]
    system = client.get("/redfish/v1/Systems/1").json()
    assert system["PowerState"] == "On"
    assert system["Oem"]["Hpe"]["LastResetType"] is None


def test_patch_asset_tag_is_supported():
    response = client.patch("/redfish/v1/Systems/1", json={"AssetTag": "RACK-B-42"})
    assert response.status_code == 200
    assert response.json()["AssetTag"] == "RACK-B-42"


def test_unknown_system_returns_404():
    response = client.get("/redfish/v1/Systems/99")
    assert response.status_code == 404
