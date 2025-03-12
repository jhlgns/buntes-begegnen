using System.Runtime.CompilerServices;
using System.Text;
using System.Web;

namespace BuntesBegegnen.Api.Email;

// NOTE: Watch out when putting user input into attributes, they might still contain JavaScript code
// which will get interpreted.
// Only use this class for internal, hard-coded email templates and stuff like this where the template
// code AND the inputs are trusted.
[InterpolatedStringHandler]
public readonly ref struct HtmlInterpolatedStringBuilder
{
    private readonly StringBuilder _builder;

    public HtmlInterpolatedStringBuilder(int literalLength, int formattedCount)
        => _builder = new(literalLength);

    public readonly void AppendLiteral(string value)
        => _builder.Append(value);

    public readonly void AppendFormatted<T>(T value)
        => _builder.Append(
            value switch
            {
                HtmlBody body => body.SanitizedValue,
                _ => HttpUtility.HtmlEncode(value?.ToString())
            });

    public readonly void AppendFormatted<T>(T value, string format) where T : IFormattable
        => _builder.Append(HttpUtility.HtmlEncode(value?.ToString(format, null)));

    internal readonly string GetFormattedString()
        => _builder.ToString();
}

public class HtmlBody
{
    public HtmlBody(HtmlInterpolatedStringBuilder value)
        => SanitizedValue = value.GetFormattedString();

    public string SanitizedValue { get; }

    public override string ToString() => SanitizedValue;
}
