import roomModal from "../Models/roomModal.js";

class RoomService {
    async create(payload) {
        const { topic, roomType, ownerId } = payload;
        const room = await roomModal.create(
            {
                topic,
                roomType,
                ownerId,
                speakers: [ownerId]
            }
        );
        return room;
    }
    async getAllRooms(types) {
        const rooms = await roomModal.find({
            roomType: { $in: types }
        })
            .populate('speakers')
            .populate('ownerId')
            .exec();
        return rooms;
    }
}

/*
{
    "allRooms": [
        {
            "id": "658543ca09c467b86f7f8e94",
            "topic": "Javascript is a fantastic language",
            "roomType": "open",
            "speakers": [
                "657d521f40697ceb36e267fc"
            ],
            "ownerId": "657d521f40697ceb36e267fc",
            "createdAt": "2023-12-22T08:07:38.783Z"
        },
        {
            "id": "658546bf09c467b86f7f8eaa",
            "topic": "C id first lang",
            "roomType": "open",
            "speakers": [
                "657d521f40697ceb36e267fc"
            ],
            "ownerId": "657d521f40697ceb36e267fc",
            "createdAt": "2023-12-22T08:20:15.899Z"
        },
        {
            "id": "658546f009c467b86f7f8ec0",
            "topic": "testing",
            "roomType": "open",
            "speakers": [
                "657d521f40697ceb36e267fc"
            ],
            "ownerId": "657d521f40697ceb36e267fc",
            "createdAt": "2023-12-22T08:21:04.974Z"
        },
        {
            "id": "6585471309c467b86f7f8ef4",
            "topic": "testing again",
            "roomType": "open",
            "speakers": [
                "657d521f40697ceb36e267fc"
            ],
            "ownerId": "657d521f40697ceb36e267fc",
            "createdAt": "2023-12-22T08:21:39.324Z"
        },
        {
            "id": "65854caa223f4afc27a6d3d9",
            "topic": "coders gyan rocks",
            "roomType": "open",
            "speakers": [
                "657d521f40697ceb36e267fc"
            ],
            "ownerId": "657d521f40697ceb36e267fc",
            "createdAt": "2023-12-22T08:45:30.483Z"
        }
    ]
}
*/
export default new RoomService();