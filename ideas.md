```
(O16 :: string ?? "Player 1") + "Tricks Taken"
```

Becomes

```
CONCATENATE(IF(ISBLANK($O$16), "Player 1", $O$16), " Tricks Taken")
```

:: String is a type annotation
?? Is a null coalescing operator

-   concatenates

```
range = $S2:$Y2 // look you can add comments too!

// The return here is an optional statement that makes it more clear what the output of your script will be.
return sumIf(range, ">0") ^ 2 - sumIf(range, "<0") ^ 2 - 0.1 * (Z2 ^ 2)
```

// is a comment

```
SUMIF($S2:$Y2, ">0") ^ 2 - SUMIF($S2:$Y2, "<0")^2 - 0.1 * (Z2^2)
```

```

```

// preview has ast, etc like the mdx website?

haskell like function composition

```
sum . map . $A2
$A2 # map # sum
```
