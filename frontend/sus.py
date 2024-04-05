def mogus(n: int):
    cache = [-1] * (n+1)

    def dp(n: int) -> int:
        if n <= 0: return 0
        if n == 1 or n == 2: return 1

        if cache[n] != -1: return cache[n]

        ans = dp(n-3) + dp(n-2) + dp(n-1)
        cache[n] = ans
        return ans

    return dp(n)

joe = {}

for i in range(38):
    joe[i] = mogus(i)

for key, value in joe.items():
    print(f"\t\tif n == {key}: return {value}")
