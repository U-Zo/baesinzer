package projectw.baesinzer.domain;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class Room {

    private String roomId = UUID.randomUUID().toString();
    private String roomName;
    private long userCount;
    private List<String> users;

    public static Room create(String name) {
        Room room = new Room();
        room.setRoomName(name);

        return room;
    }
}
