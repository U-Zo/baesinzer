package projectw.baesinzer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import projectw.baesinzer.domain.Room;
import projectw.baesinzer.repository.RoomRepository;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    // 전체 방 목록 조회
    public List<Room> findRooms() {
        List<Room> list = new ArrayList<>(roomRepository.findAll().values());
        Collections.reverse(list);
        return list;
    }

    // 방 코드로 조회
    public Room findOne(String roomCode) {
        return roomRepository.findByRoomCode(roomCode).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 방입니다."));
    }

    // 방 만들기
    public Room addRoom(String roomName) {
        Room room = new Room(roomName);
        room.setRoomCode(UUID.randomUUID().toString());
        room.setUsers(new HashMap<>());
        roomRepository.sava(room);
        return room;
    }

    // 방 제거
    public void removeRoom(Room room) {
        roomRepository.deleteByRoomCode(room.getRoomCode());
    }
}
