package com.everstarbackauth.domain.user.model;


import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public enum Role {

    ROLE_USER("ROLE_USER");

    private String role;
}
