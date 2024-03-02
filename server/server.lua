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

CreateThread(function ()
    GlobalState:set('limit', 3, true)
end)

RegisterCommand('bucket', function (source, args, raw)
    local player = source
    print(GetEntityRoutingBucket(GetPlayerPed(player)))
end)
