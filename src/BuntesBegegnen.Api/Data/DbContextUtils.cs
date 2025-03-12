# if false

using System.Linq.Expressions;
using AutoMapper.QueryableExtensions;
using BuntesBegegnen.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BuntesBegegnen.Api.Data;

public record EntityRange(int? Start, int? Count);

public record EntityQueryParameters<TEntity>(
    Expression<Func<TEntity, object>>[] Includes,
    Expression<Func<TEntity, bool>>? Filter,
    Expression<Func<TEntity, object>>? OrderBy,
    EntityRange? Range);

public class DbContextUtils
{
    public static IQueryable<TProjection> ApplyQueryParameters<TEntity, TProjection>(
            IQueryable<TEntity> baseQuery,
            Func<IQueryable<TEntity>, IQueryable<TEntity>> transformQuery,
            EntityQueryParameters<TEntity> parameters,
            AutoMapper.IConfigurationProvider mapperConfigurationProvider)
        where TEntity : Entity
    {
        var query = baseQuery;

        foreach (var include in parameters.Includes)
        {
            query = query.Include(include);
        }

        transformQuery(query);

        if (parameters.Filter != null)
        {
            query = query.Where(parameters.Filter);
        }

        if (parameters.OrderBy != null)
        {
            query = query.OrderBy(parameters.OrderBy);
        }
        else
        {
            query = query.OrderBy(x => x.Id);
        }

        if (parameters.Range is not null and not { Start: null, Count: null })
        {
            query = query
                .Skip(parameters.Range?.Start ?? 0)
                .Take(parameters.Range?.Count ?? int.MaxValue);
        }

        var projection = query.ProjectTo<TProjection>(mapperConfigurationProvider);

        return projection;
    }
}

#endif
