package projectw.baesinzer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import projectw.baesinzer.domain.Room;
import projectw.baesinzer.repository.RoomRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

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
    public Room findOne(String roomId) {
        return roomRepository.findByRoomId(roomId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 방입니다."));
    }

    // 방 만들기
    public Room addRoom(String roomName) {
        Room room = new Room(roomName);
        room.setRoomId(UUID.randomUUID().toString());
        room.setUsers(new ArrayList<>());
        return room;
    }
}
