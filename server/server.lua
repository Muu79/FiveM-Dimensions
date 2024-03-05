RegisterNetEvent('ch_buckets:warp', function(bucketId, vehicleNetId)
    local targetId = source
    Player(targetId).state:set('dimension', bucketId, true)
    if not vehicleNetId then
        SetPlayerRoutingBucket(targetId, bucketId)
    else
        local vehicleId = NetworkGetEntityFromNetworkId(vehicleNetId)
        print(vehicleId, vehicleNetId)
        SetPlayerRoutingBucket(targetId, bucketId)
        SetEntityRoutingBucket(vehicleId, bucketId)
    end
    print(Player(targetId).state.dimension)
end)

CreateThread(function()
    GlobalState:set('limit', 5, true)
    GlobalState:set('seekerTime', 100, true)
    GlobalState:set('hiderTime', 3000, true)
end)

RegisterNetEvent('ch_dimensions:updateLimit', function(newLimit)
    if (tonumber(newLimit) == nil) then
        TriggerClientEvent('chat:addMessage', source, { args = { '~r~Please enter a valid number of dimensions' } })
    elseif tonumber(newLimit) > 99 then
        TriggerClientEvent('chat:addMessage', source, { args = { '~r~Please enter a limit less than 100' } })
    else
        GlobalState:set('limit', tonumber(newLimit), true)
        TriggerClientEvent('ch_dimensions:updateReact', source)
    end
end)

RegisterNetEvent('ch_dimensions:setCDTime', function(cdType, newCd)
    print('hit server side', cdType, newCd)
    if cdType == 'hider' then
        GlobalState:set('hiderTime', newCd * 1000.0 --[[Converts seconds to ms]], true)
    elseif cdType == 'seeker' then
        GlobalState:set('seekerTime', newCd * 1000.0, true)
    else
        print("Invalid type on ch_dimensions:setCDTime")
    end
    TriggerClientEvent('ch_dimensions:updateReact', source)
    print(string.format("hider time: %s     seekerTime: %s", GlobalState.hiderTime, GlobalState.seekerTime))
end)

RegisterCommand('bucket', function(source, args, raw)
    local player = source
    print(GetEntityRoutingBucket(GetPlayerPed(player)))
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
  