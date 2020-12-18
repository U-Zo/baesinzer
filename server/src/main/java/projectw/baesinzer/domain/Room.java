package projectw.baesinzer.domain;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@RequiredArgsConstructor
public class Room {

    private String roomCode;

    @NonNull
    private String roomName;
    private int count;
    private Map<Integer, UserInfo> users;
    private boolean start;
    private List<DeadUser> deadList;
}
