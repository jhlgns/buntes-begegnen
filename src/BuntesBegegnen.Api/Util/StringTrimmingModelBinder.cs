using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BuntesBegegnen.Api.Util;

public class StringTrimmingModelBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var valueProviderResult = bindingContext.ValueProvider.GetValue(
            bindingContext.ModelName);

        if (valueProviderResult == ValueProviderResult.None)
        {
            return Task.CompletedTask;
        }

        bindingContext.Result = ModelBindingResult.Success(valueProviderResult.FirstValue?.Trim());

        return Task.CompletedTask;
    }
}

public class StringTrimmingModelBinderProvider : IModelBinderProvider
{
    public IModelBinder? GetBinder(ModelBinderProviderContext context)
    {
        if (context.Metadata.ModelType != typeof(string))
        {
            return null;
        }

        if (context.BindingInfo.BindingSource == BindingSource.Body)
        {
            return null;
        }

        // NOTE: Brauchen wir [IgnoreTrim]?

        return new StringTrimmingModelBinder();
    }
}
