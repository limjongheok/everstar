package com.everstarbackmain.domain.user.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public enum Role {

    ROLE_USER("ROLE_STUDENT");

    private String role;
}
