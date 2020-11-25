package projectw.baesinzer.domain;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserInfo {

    private int userNo;
    private String username;
    private int locationId;
    private boolean dead;
    private boolean baesinzer;
    private int hasVoted;
    private int votedNum;
    private List<Mission> missionList;
    private boolean host;
    private int kill;
}
