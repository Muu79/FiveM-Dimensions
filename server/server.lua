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
    else
        GlobalState:set('limit', tonumber(newLimit), true)
    end
end)

RegisterNetEvent('ch_dimensions:setCDTime', function(cdType, newCd)
    if cdType == 'hider' then
        GlobalState:set('hiderTime', newCd * 1000 --[[Converts seconds to ms]])
    elseif cdType == 'seeker' then
        GlobalState:set('seekerTime', newCd * 1000)
    else
        print("Invalid type on ch_dimensions:setCDTime")
    end
end)

RegisterCommand('bucket', function(source, args, raw)
    local player = source
    print(GetEntityRoutingBucket(GetPlayerPed(player)))
end)
