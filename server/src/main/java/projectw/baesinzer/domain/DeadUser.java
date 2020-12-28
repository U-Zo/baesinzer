package projectw.baesinzer.domain;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class DeadUser {
    @NonNull
    private String username;

    @NonNull
    private int locationId;
}
