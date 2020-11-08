package projectw.baesinzer.repository;

import org.springframework.stereotype.Repository;
import projectw.baesinzer.domain.Room;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Repository
public class RoomRepository {

    private final Map<String, Room> roomMap = new LinkedHashMap<>();

    public Map<String, Room> findAll() {
        return roomMap;
    }

    public Optional<Room> findByRoomCode(String roomCode) {
        return Optional.ofNullable(roomMap.get(roomCode));
    }

    public void sava(Room room) {
        roomMap.put(room.getRoomCode(), room);
    }

    public void deleteByRoomCode(String roomCode) {
        roomMap.remove(roomCode);
    }
}
