# Jump

A strongly-typed programming language designed for writing high-quality code quickly.

Note: Jump is a work-in-progress toy programming language. It takes a lot of inspiration
from typescript (the good parts) and a bit of python (the parts that I can bear). It's currently an interpreter, but I will be writing a compiler later.

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
void add(int x, int y = 0, {int base = 10}) {
	// convert bases
    return x + y;
}


```

### Todo

-   Stage 1
-   A variable cannot be updated if it is declared later in the same scope, even if it is also declared in an outer scope.

### Future features being considered

-   Pipe operator (.>) e.g. `arr.filter().>mycustomfunction(#)`
    -   If the # is present, it will be replaced with the previous value (this can be done multiple times)
    -   Otherwise, the value will be called as a unary function and passed the previous value
