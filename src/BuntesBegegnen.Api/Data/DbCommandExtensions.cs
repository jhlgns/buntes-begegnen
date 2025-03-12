using System;
using System.Data.Common;

namespace BuntesBegegnen.Api.Data;

public static class DbCommandExtensions
{
    public static DbParameter CreateParameter(this DbCommand command, string name, object? value)
    {
        var parameter = command.CreateParameter();
        parameter.ParameterName = name;
        parameter.Value = value ?? DBNull.Value;
        command.Parameters.Add(parameter);
        return parameter;
    }
}
