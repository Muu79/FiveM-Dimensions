RegisterNetEvent('ch_buckets:warp', function(bucketId, vehicleNetId)
    local targetId = source
    Player(targetId).state:set('dimension', bucketId, true)
    TriggerClientEvent('ch_dimensions:updateReact', source)
    if not vehicleNetId then
        SetPlayerRoutingBucket(targetId, bucketId)
    else
        local vehicleId = NetworkGetEntityFromNetworkId(vehicleNetId)
        SetPlayerRoutingBucket(targetId, bucketId)
        SetEntityRoutingBucket(vehicleId, bucketId)
    end
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
    if cdType == 'hider' then
        GlobalState:set('hiderTime', newCd * 1000.0 --[[Converts seconds to ms]], true)
    elseif cdType == 'seeker' then
        GlobalState:set('seekerTime', newCd * 1000.0, true)
    else
        return
    end
    TriggerClientEvent('ch_dimensions:updateReact', source)
    TriggerClientEvent('ch_dimensions:updateTimers', source)
end)
