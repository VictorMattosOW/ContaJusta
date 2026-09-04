package com.example.conta_justa.application.useCases;

import com.example.conta_justa.domain.Money;
import com.example.conta_justa.domain.Order;
import com.example.conta_justa.domain.OrderPerUser;
import com.example.conta_justa.domain.SharedFood;
import com.example.conta_justa.domain.User;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;

/**
 * DivisionService
 */

@Service
public class DivisionService {

  public List<OrderPerUser> calculateConsumption(
    List<User> users,
    List<Order> orders,
    int taxPercent
  ) {
    if (
      orders == null || orders.isEmpty() || users == null || users.isEmpty()
    ) {
      return List.of();
    }

    if (taxPercent < 0) throw new IllegalArgumentException(
      "Taxa não pode ser menor que 0"
    );

    Map<UUID, OrderPerUser> map = buildInitialMap(users);

    for (Order order : orders) {
      Set<User> shared = order.getFoodShared();
      if (
        shared == null || shared.isEmpty()
      ) throw new IllegalArgumentException(
        "Order " + order.getId() + " não tem usuários compartilhados"
      );

      Money totalWithTax = order
        .getPrice()
        .multiply(order.getQuantidade())
        .withTax(taxPercent);

      List<Money> shares = totalWithTax.splitEqually(shared.size());

      int i = 0;
      for (User user : shared) {
        OrderPerUser current = map.get(user.getId());
        if (current == null) throw new IllegalArgumentException(
          "User " + user.getId() + " not found in consumption map"
        );

        Money share = shares.get(i);
        OrderPerUser updated = new OrderPerUser(
          current.userId(),
          current.name(),
          concat(
            current.orders(),
            new SharedFood(order.getId().toString(), order.getFoodName(), share)
          ),
          current.totalValue().add(share)
        );
        map.put(user.getId(), updated);
        i++;
      }
    }
    return new ArrayList<>(map.values());
  }

  public Money sumTotalOrders(List<Order> orders, int taxPercent) {
    Money total = Money.ZERO;
    for (Order o : orders) {
      total = total.add(
        o.getPrice().multiply(o.getQuantidade()).withTax(taxPercent)
      );
    }
    return total;
  }

  private Map<UUID, OrderPerUser> buildInitialMap(List<User> users) {
    Map<UUID, OrderPerUser> map = new LinkedHashMap<>();
    for (User u : users)
      map.put(
        u.getId(),
        new OrderPerUser(u.getId(), u.getName(), new ArrayList<>(), Money.ZERO)
      );
    return map;
  }

  private List<SharedFood> concat(List<SharedFood> a, SharedFood b) {
    List<SharedFood> l = new ArrayList<>(a);
    l.add(b);
    return l;
  }
}
