package projectw.baesinzer.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@SequenceGenerator(
        name = "VERIFICATION_SEQ_GEN",
        sequenceName = "VERIFICATION_SEQ"
)
@Getter
@Setter
public class VerificationToken {
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_VERIFIED = "VERIFIED";

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "VERIFICATION_SEQ_GEN"
    )
    private Long id;
    private String token;
    private String status = STATUS_PENDING;
    private LocalDateTime expireDateTime;

    @OneToOne
    @JoinColumn(name = "USER_ID")
    private User user;
}
