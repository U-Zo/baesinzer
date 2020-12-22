package projectw.baesinzer.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Message {

    // 메시지 타입: 입장, 대기방, 인 게임, 퇴장
    public enum MessageType {
        JOIN, ROOM, START, PLAY, MOVE, KILL, TURN_OFF, CLOSE_LOCATION, VOTE_START, VOTE, VOTE_END, END, EXIT
    }

    private MessageType type;   // 메시지 타입
    private String roomCode;
    private UserInfo userInfo;
    private String message;
    private Room room;
}
