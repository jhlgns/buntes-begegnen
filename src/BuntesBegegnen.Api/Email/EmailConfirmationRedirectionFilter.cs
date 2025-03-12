using System.Web;
using BuntesBegegnen.Api.UserManagement;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BuntesBegegnen.Api.Email;

public class EmailConfirmationRedirectionFilter : IPageFilter
{
    public void OnPageHandlerSelected(PageHandlerSelectedContext context)
    {
        var user = context.HttpContext.User;

        if (user.Identity?.IsAuthenticated == false)
        {
            return;
        }

        var hasConfirmedEmail = user.HasClaim(x =>
            x.Type == ClaimTypes.EmailAddressConfirmed &&
            x.Value == ClaimValueConstants.EmailAddressIsConfirmed);
        if (hasConfirmedEmail)
        {
            return;
        }

        if (context.ActionDescriptor.EndpointMetadata.Any(x => x is IgnoreEmailConfirmationAttribute))
        {
            return;
        }

        var returnUrl = context.HttpContext.Request.GetEncodedPathAndQuery();
        context.HttpContext.Response.Redirect($"/email-bestaetigen?returnUrl={HttpUtility.UrlEncode(returnUrl)}");
    }

    public void OnPageHandlerExecuting(PageHandlerExecutingContext context)
    {
    }

    public void OnPageHandlerExecuted(PageHandlerExecutedContext context)
    {
    }
}
