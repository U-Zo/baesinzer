package projectw.baesinzer.repository;

import org.springframework.stereotype.Repository;
import projectw.baesinzer.domain.Room;

import java.util.*;

@Repository
public class RoomRepository {

    private final Map<String, Room> roomMap = new LinkedHashMap<>();

    public List<Room> findAllRoom() {

        List<Room> rooms = new ArrayList<>(roomMap.values());
        Collections.reverse(rooms);

        return rooms;
    }

    public Room findByRoomId(String id) {
        return roomMap.get(id);
    }

    public Room createRoom(String name) {
        Room room = Room.create(name);
        roomMap.put(room.getRoomId(), room);
        room.setUsers(new ArrayList<>());
        return room;
    }
}
