# Kotlin Cheat Sheet for Java/C# Developers

Concepts needed to read/convert the `Server/` codebase to Kotlin, mapped to the closest
Java or C# equivalent (whichever explains it better). Examples reference our actual files
(`RegisterDto`, `BusService`, `AuthController`, `JWTGenerator`).

## Quick Reference

| Kotlin | Java | C# |
|---|---|---|
| `val x = 1` | `final var x = 1` | `readonly` / `const` (closest) |
| `var x = 1` | `var x = 1` | `x = 1` (plain mutable local) |
| `String?` / `String` | no distinction (`@Nullable`) | `string?` / `string` (nullable refs) |
| `a?.length` | `Optional.map(...)` chains | `a?.Length` — identical |
| `a ?: default` | `orElse(default)` | `a ?? default` — identical |
| `x!!` | (dereference & pray) | `x!` — but see note, not the same |
| `data class` | `record` | `record` |
| `fun f(): Int = 1` | `int f() { return 1; }` | expression-bodied member `=> 1` |
| `Unit` | `void` | `void` (but `Unit` is a real type) |
| `companion object` | `static` members | `static` members |
| `"$name is $age"` | text blocks (no interpolation) | `$"{name} is {age}"` |
| `when (x) { ... }` | switch expressions (21+) | switch expressions (8.0+) |
| `filter` / `map` / `sortedBy` | Streams + `collect` | LINQ `Where` / `Select` / `OrderBy` |
| `@field:NotNull` | (automatic on records) | `[field: ...]` on record parameters |
| extension functions | — (none) | extension methods |
| `x is String` + smart cast | `x instanceof String s` | `x is string s` |
| `sealed class` | `sealed class` + `permits` | (no equivalent yet) |

## 1. `val` vs `var` — and the C# trap

```kotlin
val phone = "0901234567"   // read-only: Java `final`, reassignment is a compile error
var fare = 100.0           // mutable
```

> **C# trap:** Kotlin `var` ≠ C# `var`. C# `var` means "infer the type" (still mutable).
> Kotlin `var` means "mutable" (type is *always* inferred when possible). Kotlin has no
> keyword for "infer type" — inference is just how it works.

Rule of thumb for our codebase: everything is `val` until proven otherwise.

## 2. Null Safety — the flagship feature

Types are non-nullable by default. `?` makes a type nullable, and the compiler forces
you to handle it:

```kotlin
fun searchBuses(sortByFare: SortType?, busType: BusType?): List<Bus> {
    if (sortByFare != null) { /* smart-cast to SortType here */ }
}
```

| Operator | Meaning | C# equivalent | Java equivalent |
|---|---|---|---|
| `s?.length` | null-safe call → `Int?` | `s?.Length` | `Optional.ofNullable(s).map(...)` |
| `s ?: "n/a"` | Elvis: fallback if null | `s ?? "n/a"` | `orElse("n/a")` |
| `s!!` | "trust me" — throws NPE if null | `s!` **but C# only suppresses the warning at compile time; Kotlin throws at runtime** | — |
| `s?.let { ... }` | run block only if non-null | `if (s is not null) { ... }` | `ifPresent(...)` |

Idiomatic pattern in our services — Java's `if (dto.getFare() != null) bus.setFare(...)`
becomes:

```kotlin
dto.fare?.let { bus.fare = it }
```

> **Smart-cast limitation:** the compiler can smart-cast `val`s and local variables, but
> **not mutable properties** (they could change between check and use). Use `?.let` or
> copy to a local `val` first. This trips up every beginner.

## 3. `==` vs `===`

```kotlin
a == b    // structural equality → calls equals()   ⚠️ opposite of Java!
a === b   // referential equality → Java's == for objects
```

C# note: `==` in C# is referential by default for classes but value-based for records —
Kotlin's `==` behaves like C# record equality everywhere.

## 4. `data class` — Java records / C# records

```kotlin
data class AuthResponseDto(
    val accessToken: String,
    val customerId: String,
    val role: String,
    val tokenType: String = "Bearer ",
)
```

Generates `equals`/`hashCode`/`toString`/`copy()`/destructuring from the primary
constructor. Replaces Lombok `@Data` entirely.

Differences from Java records:
- Kotlin data class properties can be `var` (mutable); Java record components are always final.
- Kotlin has `copy(...)` built in for "same but change one field":

```kotlin
val updated = dto.copy(role = "ADMIN")   // C#: dto with { Role = "ADMIN" }; Java: manual "wither"
```
- Only **primary constructor** properties participate in `equals`/`hashCode` — properties declared in the class body do not. (Java records: all components do.)

## 5. Properties — C# had them all along

```kotlin
class Customer {
    var name: String = ""        // C#: public string Name { get; set; }
    val id: String? = null       // C#: public string? Id { get; }
}
```

- `val` property = getter only; `var` property = getter + setter.
- Replaces Java's field + `getX()`/`setX()` boilerplate (i.e., most of Lombok).
- **Interop bonus:** from Kotlin, Java getters look like properties — `bus.getFare()`
  can be written `bus.fare`. (But see the Lombok trap in §14.)

## 6. Primary Constructors + Default/Named Arguments

```kotlin
@Service
class BusService(private val busRepository: BusRepository) { ... }
```

One line replaces the entire Java field + `@Autowired` constructor + assignments.
Declaring `private val` in the constructor makes it an injected property.

Default parameters replace Java's method overloads / builder telescoping:

```kotlin
fun search(time: String, sort: SortType? = null)   // C# optional parameters — but Kotlin
                                                   // allows any expression, not just constants
search("08:00", sort = SortType.DESCENDING)        // named args — C# has these too
```

## 7. Classes are `final` by default

```kotlin
class A          // final — cannot be extended
open class B     // can be extended
```

Inverted vs Java (open by default, `final` opts out). C# is the same as Kotlin's
inverse: `sealed` opts in. **Kotlin = C# `sealed` on every class unless you say `open`.**

This is why Spring needs the **`kotlin-spring` (all-open) compiler plugin**: Spring
proxies `@Service`/`@Configuration` classes via subclassing, which fails on final
classes. The plugin auto-opens annotated classes. Without it → cryptic startup errors.

## 8. `companion object` — where `static` went

Kotlin has no `static` keyword. Class-level members live in a companion object:

```kotlin
class BusService(...) {
    companion object {
        private val DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd:HH:mm")
    }
}
// usage: BusService.DATETIME_FORMATTER — looks exactly like Java static access
```

Interop notes for mixed codebases:
- `const val X = "..."` → becomes a real Java `static final` field.
- `@JvmStatic fun f()` → callable from Java as `ClassName.f()` instead of `ClassName.Companion.f()`.

Related: a top-level `object Foo { ... }` declares a singleton (Java: enum singleton / holder idiom).

## 9. String Templates

```kotlin
"Validation errors: ${result.allErrors}"   // C#: $"Validation errors: {result.AllErrors}"
"User $username"                           // simple form for plain variables
```

Java has **no** string interpolation (String Templates were previewed then withdrawn in
JDK 23) — this is pure quality-of-life over `String.format()`/concatenation.

## 10. `when` — switch expressions, grown up

```kotlin
when (sortByFare) {
    SortType.DESCENDING -> buses.sortedByDescending { it.fare }
    SortType.ASCENDING  -> buses.sortedBy { it.fare }
    null                -> buses
}
```

- It's an **expression** (returns a value) — like Java 21 / C# 8 switch expressions.
- No `break`, no fall-through (C# requires `break`; Kotlin doesn't).
- Matches types, ranges, and arbitrary conditions — closer to C# pattern matching than
  to old Java switch. With `sealed class` subjects, the compiler enforces exhaustiveness.

## 11. Functions, Lambdas, and `it`

```kotlin
fun getBusById(id: String): Bus =              // expression body — C# `=>`
    busRepository.findById(id)
        .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Bus not found") }
```

- `fun` declares; return type after `:`. Omitting it means `Unit` (≈ `void`, but a real
  type — generics don't need the `Void` hack).
- Single-parameter lambdas get an implicit `it` (C#: you always name it — `x => x.Fare`).
- **Trailing lambda:** if the last parameter is a function, it goes outside the parens —
  `orElseThrow { ... }` above. This is why Kotlin APIs read like DSLs.

## 12. Collections — LINQ is the best mental model

Java Streams require `.stream()` + `.collect(...)`; Kotlin stdlib functions return
collections directly, exactly like LINQ-to-Objects:

| Kotlin | C# LINQ | Java Streams |
|---|---|---|
| `filter { }` | `Where(...)` | `filter(...)` |
| `map { }` | `Select(...)` | `map(...)` |
| `sortedBy { it.fare }` | `OrderBy(x => x.Fare)` | `sorted(comparing(...))` |
| `find { }` / `firstOrNull { }` | `FirstOrDefault(...)` | `filter().findFirst()` |
| `any { }` / `all { }` | `Any(...)` / `All(...)` | `anyMatch` / `allMatch` |
| `sumOf { it.fare }` | `Sum(x => x.Fare)` | `mapToDouble().sum()` |

Our `BusService.searchBuses` — 20 lines of Comparator/Streams become:

```kotlin
if (sortByFare != null)
    buses = buses.sortedBy { it.fare }.let { if (sortByFare == SortType.DESCENDING) it.reversed() else it }
if (busType != null) buses = buses.filter { it.busType == busType }
```

> **Laziness:** Kotlin collection ops are *eager* by default (unlike LINQ/Streams).
> Use `.asSequence()` for deferred execution on large chains — that's the true
> `IEnumerable`/`Stream` equivalent.

## 13. Scope Functions — no Java/C# equivalent

Five functions that run a block on an object; differ in `this` vs `it` and return value:

| Function | Receiver | Returns | Typical use |
|---|---|---|---|
| `let` | `it` | block result | null-safe transforms (`x?.let { }`) |
| `apply` | `this` | the object | configuring an object |
| `also` | `it` | the object | side effects (logging) |
| `run` | `this` | block result | compute from an object |
| `with(x)` | `this` | block result | grouping calls on x |

`apply` is the one you'll see most — it kills the setter parade in `AuthController.register`:

```kotlin
val customer = Customer().apply {
    phone = dto.phone
    email = dto.email
    password = passwordEncoder.encode(dto.password)
    role = Role.USER
}
```

> **C# warning:** C#'s `with` (`record with { X = 1 }`) is *copy-with* — completely
> different from Kotlin's `with`. Don't pattern-match on the keyword.

## 14. Annotation Use-Site Targets — `@field:Pattern`

Kotlin constructor properties compile to *three* things: a constructor parameter, a
field, and a getter. An annotation without a target may land on the wrong one — and
**bean validation silently stops working**:

```kotlin
data class RegisterDto(
    @field:Pattern(regexp = "^(0|\\+84)\\d{9}$", message = "...")
    val phone: String,
)
```

- `@field:` → backing field (where Hibernate Validator looks) ✅
- `@get:` → getter • `@param:` → constructor parameter • `@setparam:` → setter

C# equivalent: attribute targets on record positional parameters — `[property: ...]` /
`[field: ...]` (C# 9+). Java equivalent: annotations on record components propagate
automatically per their `@Target` — Java makes this invisible, Kotlin makes it explicit.
**This is the #1 Kotlin+Spring gotcha.**

## 15. Smart Casts & Sealed Classes

```kotlin
if (x is String) { x.length }   // Java: if (x instanceof String s) | C#: if (x is string s)
```

`sealed class` ≈ Java 17 `sealed` + `permits`. Subclasses are fixed at compile time, so
`when` over them is exhaustive without an `else`. Good fit for ticket/booking state
machines if ours grows. (C# has no equivalent yet — discriminated unions are proposed.)

## 16. Extension Functions — same as C# extension methods

```kotlin
fun String.isVietnamPhone(): Boolean =
    matches(Regex("^(0|\\+84)\\d{9}$"))

"0901234567".isVietnamPhone()
```

Statically dispatched, just like C# extension methods — syntax sugar, not monkey-patching.
Java has no equivalent (utility classes with static methods instead).

## 17. Coroutines — for later, probably not for us

`suspend fun` ≈ C# `async Task` (compiler-transformed, cooperative). The Java analog is
virtual threads (Project Loom) — a different model (blocking-style code on cheap threads).

**Verdict for this project:** we're on Spring MVC (servlet stack), where coroutines add
complexity with little benefit. They shine with Spring WebFlux. Skip for now.

## 18. Spring Boot Specifics Checklist

When adding Kotlin to `Server/pom.xml` and converting files:

1. **`kotlin-maven-plugin`** with the **`kotlin-spring` (all-open)** plugin — required
   or Spring can't proxy your beans (§7). `kotlin-jpa`/`noarg` is only needed for JPA
   entities — we use MongoDB, so skip it.
2. **`jackson-module-kotlin`** dependency — Jackson can't instantiate Kotlin data
   classes (no no-arg constructor) without it.
3. **`@field:` on all validation annotations** in DTOs (§14).
4. **No `@Autowired`** on single-constructor classes — just the primary constructor (§6).
5. **Lombok visibility trap:** Kotlin compiles *before* `javac` in a mixed Maven build,
   so Kotlin code **cannot see Lombok-generated methods** on Java classes. `bus.fare`
   fails to compile while `Bus` is still a `@Data` Java class. Consequence: convert a
   Java class's Kotlin callers in the same wave, or convert models first.
6. **`lateinit var`** exists for field injection/`@Value` scenarios, but prefer
   constructor injection everywhere.
7. **MongoDB documents:** Spring Data needs mutable classes with a no-arg path — keep
   `model/` as Java, or convert last using `var` properties with defaults (not
   data-class-pure `val`s).

## Useful References

- [Kotlin for Java Developers (official)](https://kotlinlang.org/docs/java-to-kotlin-interop.html)
- [Kotlin idioms](https://kotlinlang.org/docs/idioms.html)
- [Spring Boot with Kotlin (official guide)](https://spring.io/guides/tutorials/spring-boot-kotlin)
- [kotlin-spring / all-open plugin](https://kotlinlang.org/docs/all-open-plugin.html#spring-support)
- [Scope functions guide](https://kotlinlang.org/docs/scope-functions.html)
- [Annotation use-site targets](https://kotlinlang.org/docs/annotations.html#annotation-use-site-targets)
