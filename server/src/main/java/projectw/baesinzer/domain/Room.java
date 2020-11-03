package projectw.baesinzer.domain;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
public class Room {

    private String roomId;

    @NonNull
    private String roomName;

    private long userCount;
    private List<UserInfo> users;
}
