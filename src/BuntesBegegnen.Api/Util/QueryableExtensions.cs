using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace BuntesBegegnen.Api.Util;

public static class QueryableExtensions
{
    public static IQueryable<T> Include<T>(
        this IQueryable<T> queryable,
        IEnumerable<Expression<Func<T, object>>>? includes)
        where T : class
    {
        foreach (var include in includes ?? [])
        {
            queryable = queryable.Include(include);
        }

        return queryable;
    }
}
