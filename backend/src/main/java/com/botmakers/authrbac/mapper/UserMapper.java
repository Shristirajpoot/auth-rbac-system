package com.botmakers.authrbac.mapper;

import com.botmakers.authrbac.dto.UserDto;
import com.botmakers.authrbac.entity.User;
import com.botmakers.authrbac.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "role", source = "roles", qualifiedByName = "mapRolesToSingleRoleString")
    UserDto toDto(User user);

    @Named("mapRolesToSingleRoleString")
    default String mapRolesToSingleRoleString(Set<Role> roles) {
        if (roles == null || roles.isEmpty()) {
            return "USER";
        }
        // Check if user has ROLE_ADMIN role, if so return "ADMIN", else "USER"
        boolean isAdmin = roles.stream()
                .anyMatch(role -> role.getName() != null && role.getName().name().equals("ROLE_ADMIN"));
        return isAdmin ? "ADMIN" : "USER";
    }
}
