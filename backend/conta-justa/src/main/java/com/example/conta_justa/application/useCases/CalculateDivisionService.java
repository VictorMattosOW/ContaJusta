package com.example.conta_justa.application.useCases;

import com.example.conta_justa.api.dtos.CalculateDivisionRequestDto;
import com.example.conta_justa.api.dtos.CalculateDivisionResponseDto;
import com.example.conta_justa.api.dtos.OrderPerUserDto;
import com.example.conta_justa.api.dtos.OrderRequestDto;
import com.example.conta_justa.api.dtos.SharedFoodDto;
import com.example.conta_justa.api.dtos.UserDto;
import com.example.conta_justa.application.id.IdGenerator;
import com.example.conta_justa.domain.Group;
import com.example.conta_justa.domain.Money;
import com.example.conta_justa.domain.Order;
import com.example.conta_justa.domain.OrderPerUser;
import com.example.conta_justa.domain.SharedFood;
import com.example.conta_justa.domain.User;
import com.example.conta_justa.infra.repository.GroupRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class CalculateDivisionService {

  private final DivisionService divisionService;
  private final GroupRepository groupRepository;
  private final IdGenerator idGenerator;

  public CalculateDivisionService(
    DivisionService divisionService,
    GroupRepository groupRepository,
    IdGenerator idGenerator
  ) {
    this.divisionService = divisionService;
    this.groupRepository = groupRepository;
    this.idGenerator = idGenerator;
  }

  public CalculateDivisionResponseDto execute(
    CalculateDivisionRequestDto request
  ) {
    Map<UUID, User> userMap = request
      .users()
      .stream()
      .collect(Collectors.toMap(UserDto::id, this::toUser));

    List<Order> orders = request
      .orders()
      .stream()
      .map(dto -> toOrder(dto, userMap))
      .toList();

    List<User> users = userMap.values().stream().toList();

    List<OrderPerUser> result = divisionService.calculateConsumption(
      users,
      orders,
      request.tax()
    );

    Money total = divisionService.sumTotalOrders(orders, request.tax());

    Group g = new Group(
      idGenerator.generate(),
      request.groupName(),
      total.amount(),
      users,
      result
    );

    this.groupRepository.save(g);
    List<OrderPerUserDto> ordersPerUser = result
      .stream()
      .map(this::toOrderPerUserDto)
      .toList();
    return new CalculateDivisionResponseDto(total.amount(), ordersPerUser);
  }

  // AGORA preserva o id do request (um único id por usuário)
  private User toUser(UserDto dto) {
    return new User(dto.id(), dto.name());
  }

  private Order toOrder(OrderRequestDto dto, Map<UUID, User> userMap) {
    Set<User> shared = new HashSet<>();
    for (UserDto userId : dto.sharedUsers()) {
      User u = userMap.get(userId.id());
      if (u == null) {
        throw new IllegalArgumentException("Usuário não encontrado: " + userId);
      }
      shared.add(u);
    }
    return new Order(
      idGenerator.generate(),
      dto.name(),
      shared,
      new Money(dto.price()),
      dto.quantity()
    );
  }

  private OrderPerUserDto toOrderPerUserDto(OrderPerUser opu) {
    List<SharedFoodDto> sharedDtos = opu
      .orders()
      .stream()
      .map(this::toSharedFoodDto)
      .toList();
    return new OrderPerUserDto(
      opu.userId(),
      opu.name(),
      opu.totalValue().amount(),
      sharedDtos
    );
  }

  private SharedFoodDto toSharedFoodDto(SharedFood sf) {
    return new SharedFoodDto(
      sf.orderId(),
      sf.food(),
      sf.sharedValue().amount()
    );
  }
}
