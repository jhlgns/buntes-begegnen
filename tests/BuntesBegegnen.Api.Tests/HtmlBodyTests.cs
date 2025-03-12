using BuntesBegegnen.Api.Email;

namespace BuntesBegegnen.Api.Tests;

public class HtmlBodyTests
{
    // TODO: Make sure nothing malicious can be put into attributes! @Security

    [Fact]
    public void HtmlSanitizationWithoutFormat()
    {
        var maliciousUserName = "<script>alert(0)</script>";
        var body = new HtmlBody($"<h1>Hello, dear {maliciousUserName}!</h1>");

        Assert.Equal("<h1>Hello, dear &lt;script&gt;alert(0)&lt;/script&gt;!</h1>", body.SanitizedValue);
    }

    [Fact]
    public void HtmlSanitizationWithFormat()
    {
        var value = DateTimeOffset.Now;
        var body = new HtmlBody($"<h1>It is {value:G}!</h1>");

        Assert.Equal($"<h1>It is {value:G}!</h1>", body.SanitizedValue);
    }

    [Fact]
    public void NestedHtmlBody()
    {
        var script = "<script>alert(0)</script>";
        var nestedContent = new HtmlBody($"<p>Inhalt: {script}</p>");
        var document = new HtmlBody(
            $$"""
            <!DOCTYPE html>
            <html lang="de">
            <body>
                {{nestedContent}}
            </body>
            </html>
            """);

        Assert.Equal(
            $$"""
            <!DOCTYPE html>
            <html lang="de">
            <body>
                <p>Inhalt: &lt;script&gt;alert(0)&lt;/script&gt;</p>
            </body>
            </html>
            """,
            document.SanitizedValue);
    }

    //     [Fact]
    //     public void AttributesGetSanitized()
    //     {
    //         // TODO: Think about how this might get exploited otherwise
    //
    //         var payload1 = "some-class\" onclick=\"alert('Cowabunga')\"";
    //         var document1 = new HtmlBody($"<button class=\"{payload1}\">");
    //
    //         var payload2 = "``onload=xss()";
    //         var document2 = new HtmlBody($"<img src=\"test.jpg\" alt=\"{payload2}\" />");
    //
    //         Assert.Equal(
    //             "<button class=\"some-class&quot; onclick=&quot;alert(&#39;Cowabunga&#39;)&quot;\">",
    //             document1.SanitizedValue);
    //
    //         Assert.Equal(
    //             "<img src=\"test.jpg\" alt=\"TODO\" />",
    //             document1.SanitizedValue);
    //     }
}
