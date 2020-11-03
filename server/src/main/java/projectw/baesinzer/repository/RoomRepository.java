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

    public Optional<Room> findByRoomId(String id) {
        return Optional.ofNullable(roomMap.get(id));
    }
}
