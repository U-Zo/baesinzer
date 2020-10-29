package projectw.baesinzer.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class Message {

    private String userNickname;
    private String message;
    private String roomId;
}
