# Jump

Jump is a toy programming language and compiler that I'm working on to explore interesting language concepts. It takes a lot of inspiration
from typescript and python.

It's designed to be a strongly-typed programming language that allows you to write high-quality code quickly.


### Syntax Examples

#### Stage 1

```typescript

int[] nums = [1, 2, 3, 4, 5, 9];

for (i in nums.filter(n => n % 2 == 0)) {
	print(i ** 2);
}
```

```typescript
// Functional array methods
{name: string; age: int; }[] pets = [{
	name: "Boo",
    age: 9
}, {
	name: "Pepper",
    age: 4
}];

print(pets.sort(by="age", order="asc"))
```

```typescript
// keyword arguments are defined by a prepended equal sign. Positional args must be
// positional args, and keyword args must be keyword args. You can specify a default value
// for args.
void add(x: int, y: int = 0, {base: int = 10}) {
	// convert bases
    return x + y;
}


```

### Todo

-   A variable cannot be updated if it is declared later in the same scope, even if it is also declared in an outer scope.

### Features I'm thinking about

-   Pipe operator (.>) e.g. `arr.filter().>mycustomfunction(#)`
    -   If the # is present, it will be replaced with the previous value (this can be done multiple times)
    -   Otherwise, the value will be called as a unary function and passed the previous value
