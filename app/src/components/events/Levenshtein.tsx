export function levenshteinDistance(a: any, b:any) {
    const m = a.length;
    const n = b.length;
    let d = new Array(m + 1).fill(0);
    for (let i = 0; i <= m; i++) {
      for (let j = 0; j <= n; j++) {
        if (i === 0) {
          d[j] = j;
        } else if (j === 0) {
          d[j] = i;
        } else {
          d[j] = Math.min(
            d[j - 1] + 1, // deletion
            d[j] + 1, // insertion
            d[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // substitution
          );
        }
      }
    }
    return d[n];
  }