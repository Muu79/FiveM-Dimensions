
local function toggleNuiFrame(shouldShow)
  SetNuiFocus(shouldShow, false)
  SendReactMessage('setVisible', shouldShow)
end

local function setCDTimer()
  if LocalPlayer.state.seeker then
    LocalPlayer.state:set('timer', GlobalState.seekerTime or 100, true)
  else
    LocalPlayer.state:set('timer', GlobalState.hiderTime or 3000, true)
  end
end

CreateThread(function()
  LocalPlayer.state:set('seeker', false, true)
  setCDTimer()
end)

RegisterNuiCallback('toggleSeeker', function(_, cb)
  LocalPlayer.state:set('seeker', not LocalPlayer.state.seeker or false, true)
  setCDTimer()
  cb({})
end)

RegisterNUICallback('hideFrame', function(_, cb)
  toggleNuiFrame(false)
  debugPrint('Hide NUI frame')
  cb({})
end)

RegisterNUICallback('getClientData', function(data, cb)
  debugPrint('Data sent by React', json.encode(data))

  -- Lets send back client coords to the React frame for use
  local curCoords = GetEntityCoords(PlayerPedId())

  local retData <const> = { x = curCoords.x, y = curCoords.y, z = curCoords.z }
  cb(retData)
end)

RegisterNUICallback('getMenuOptions', function(data, cb --[[function]])
  debugPrint('Data sent by react', json.encode(data))
  local MenuData <const> = {
    { name = 'Toggle Seeker' },
    { name = 'Set Dimension Limit', info = GlobalState.limit},
    { name = 'Set Warp Cooldown (Hider)', info = GlobalState.hiderTime / 1000, units ='sec'},
    { name = 'Set Warp Cooldown (Seeker)', info = GlobalState.seekerTime / 1000, units ='sec'}
  }
  cb(MenuData)
end)

RegisterNuiCallback('getCDTime', function(_, cb)
  cb({ timer = LocalPlayer.state.seeker and GlobalState.seekerTimer or GlobalState.hiderTime })
end)

RegisterNuiCallback('setCDTime', function(data, cb)
  data.type = string.lower(data.type)
  print(data.type, 'got event', data.time, tonumber(data.time))
  if not tonumber(data.time) or tonumber(data.time) > 1000 or tonumber(data.time) < 0 then
    TriggerEvent('chat:AddMessage', { args = { '~r~Please Enter a Valid Number In Seconds Between 0 And 1000' } })
    return cb({})
  end
  TriggerServerEvent('ch_dimensions:setCDTime', data.type, data.time)
  cb({})
end)

RegisterNUICallback('setDimensionLimit', function(body, cb)
  TriggerServerEvent('ch_dimensions:updateLimit', body.limit)
end)


CreateThread(function()
  LocalPlayer.state:set('dimension', 0, true)
end)

local jumpCool = false
local lastJump
RegisterNetEvent('ch_buckets:pre_warp', function(bucketId)
  -- cooldown cheker
  if jumpCool then
    if (GetGameTimer() - lastJump) > (LocalPlayer.state.timer or 1000) then
      jumpCool = false
    else
      TriggerEvent('chat:addMessage', {args={('~y~Cooldown is not up yet, %s seconds left'):format((3000 - (GetGameTimer() - lastJump))/1000)}})
      return
    end
  end

  local vehicle
  if IsPedInAnyVehicle(PlayerPedId(), true) then
    vehicle = GetVehiclePedIsIn(PlayerPedId(), true)
  end
  if vehicle then vehicle = NetworkGetNetworkIdFromEntity(vehicle) end
  TriggerServerEvent('ch_buckets:warp', bucketId, vehicle)
  lastJump = GetGameTimer()
  jumpCool = true
  LocalPlayer.state:set('dimension', bucketId, true)
  SendNUIMessage({
    type = 'dimesion-update',
    n = LocalPlayer.state.dimension + 1
  })
end)

RegisterCommand('+slideUp', function(source, args, raw)
  local limit = GlobalState.limit
  local currDimension = LocalPlayer.state.dimension
  if currDimension == limit then
    return
  elseif currDimension > limit or currDimension < 0 then
    TriggerEvent('ch_buckets:pre_warp', limit)
    return
  end
  TriggerEvent('ch_buckets:pre_warp', currDimension + 1)
end, false)
RegisterCommand('-slideUp', function(source, args, raw)
end, false)


RegisterCommand('+slideDown', function(source, args, raw)
  if LocalPlayer.state.dimension == 0 then
    return
  elseif LocalPlayer.state.dimension < 0 or LocalPlayer.state.dimension > GlobalState.limit then
    TriggerEvent('ch_buckets:pre_warp', 0)
    return
  end
  TriggerEvent('ch_buckets:pre_warp', LocalPlayer.state.dimension - 1)
end, false)
RegisterCommand('-slideDown', function(source, args, raw)
end, false)

RegisterCommand('+showMenu', function()
  toggleNuiFrame(true)
end)
RegisterCommand('-showMenu', function()
end)

RegisterKeyMapping('+showMenu', 'Show the dimension menu', 'keyboard', 'F5')
RegisterKeyMapping('+slideUp', 'Jump up a dimension', 'mouse_button', 'MOUSE_EXTRABTN2')
RegisterKeyMapping('+slideDown', 'Jump down a dimension', 'mouse_button', 'MOUSE_EXTRABTN1')
