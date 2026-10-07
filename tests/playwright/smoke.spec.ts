import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  const reset = await request.post('/lab/reset');
  expect(reset.ok()).toBeTruthy();
});

test('service root links to Systems collection', async ({ request }) => {
  const response = await request.get('/redfish/v1');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.Systems['@odata.id']).toBe('/redfish/v1/Systems');
});

test('ComputerSystem resource looks Redfish-like', async ({ request }) => {
  const response = await request.get('/redfish/v1/Systems/1');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body['@odata.type']).toContain('ComputerSystem');
  expect(body.Manufacturer).toBe('HPE');
  expect(body.Actions['#ComputerSystem.Reset']).toEqual({
    target: '/redfish/v1/Systems/1/Actions/ComputerSystem.Reset',
    'ResetType@Redfish.AllowableValues': ['On', 'ForceOff', 'GracefulRestart'],
  });
});

test('ComputerSystem Reset turns the system off with ForceOff', async ({ request }) => {
  const response = await request.post('/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', {
    data: { ResetType: 'ForceOff' },
  });
  expect(response.status()).toBe(204);
  expect(await response.text()).toBe('');

  const system = await request.get('/redfish/v1/Systems/1');
  const body = await system.json();
  expect(body.PowerState).toBe('Off');
  expect(body.Oem.Hpe.LastResetType).toBe('ForceOff');
});

test('ComputerSystem Reset turns the system on with On', async ({ request }) => {
  const response = await request.post('/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', {
    data: { ResetType: 'On' },
  });
  expect(response.status()).toBe(204);
  expect(await response.text()).toBe('');

  const system = await request.get('/redfish/v1/Systems/1');
  const body = await system.json();
  expect(body.PowerState).toBe('On');
  expect(body.Oem.Hpe.LastResetType).toBe('On');
});

test('ComputerSystem Reset keeps the system on with GracefulRestart', async ({ request }) => {
  const response = await request.post('/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', {
    data: { ResetType: 'GracefulRestart' },
  });
  expect(response.status()).toBe(204);
  expect(await response.text()).toBe('');

  const system = await request.get('/redfish/v1/Systems/1');
  const body = await system.json();
  expect(body.PowerState).toBe('On');
  expect(body.Oem.Hpe.LastResetType).toBe('GracefulRestart');
});

test('ComputerSystem Reset rejects unsupported types without mutating state', async ({ request }) => {
  const response = await request.post('/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', {
    data: { ResetType: 'InvalidResetType' },
  });
  expect(response.status()).toBe(400);
  const error = await response.json();
  const extendedInfo = error.error['@Message.ExtendedInfo'][0];
  expect(extendedInfo.MessageId).toBe('Base.1.0.PropertyValueNotInList');
  expect(extendedInfo.MessageArgs).toEqual(['ResetType', 'InvalidResetType']);

  const system = await request.get('/redfish/v1/Systems/1');
  const body = await system.json();
  expect(body.PowerState).toBe('On');
  expect(body.Oem.Hpe.LastResetType).toBeNull();
});
