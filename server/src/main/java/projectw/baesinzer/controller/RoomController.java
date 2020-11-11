package projectw.baesinzer.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import projectw.baesinzer.domain.Room;
import projectw.baesinzer.service.RoomService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping("/rooms")
    public List<Room> rooms() {
        return roomService.findRooms();
    }

    @GetMapping("/room/{roomCode}")
    public Room joinRoom(@PathVariable String roomCode) {
        Room room = roomService.findOne(roomCode);
        if (room.getUsers().size() == 6) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 가득 찬 방입니다.");
        }

        return room;
    }

    @PostMapping("/room")
    public Room createRoom(@RequestBody Map<String, String> map) {
        String roomName = map.get("roomName");
        return roomService.addRoom(roomName);
    }
}
