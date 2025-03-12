using System.ComponentModel.DataAnnotations;
using System.Reflection;
using System.Text;
using BuntesBegegnen.Api.Data.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BuntesBegegnen.Api.Controllers;

[AllowAnonymous]
[ApiController]
[Route("metadata")]
public class MetadataController : ControllerBase
{
    private static readonly NullabilityInfoContext _nullabilityInfoContext = new();
    private readonly ApiOptions _options;

    public MetadataController(IOptions<ApiOptions> options)
    {
        _options = options.Value;
    }

    [HttpGet]
    public ActionResult<ApiMetadataDto> GetMetadata()
    {
        var constraintsByType = new Dictionary<string, TypeConstraintsDto>();

        var types = typeof(MetadataController).Assembly.GetTypes();
        foreach (var type in types)
        {
            if (type.Name.EndsWith("Dto") == false)
            {
                continue;
            }

            var constraints = GenerateConstraints(type);
            constraintsByType.Add(type.Name ?? throw new InvalidOperationException(), constraints);
        }

        var result = new ApiMetadataDto(
            PreviewModeEnabled: _options.PreviewMode.IsEnabled == true,
            PreviewModeRegistrationPasswordRequired: _options.PreviewMode.RegistrationPassword is not (null or ""),
            EnableUserInteraction: _options.PreviewMode.EnableUserInteraction == true,
            ApiMetadataRefreshInterval: _options.Metadata.ApiMetadataRefreshInterval,
            TypeConstraints: constraintsByType);

        return Ok(result);
    }

    private static TypeConstraintsDto GenerateConstraints(Type type)
    {
        // NOTE: Also creates entries for fields without constraints

        var properties = type.GetProperties();

        var constraintsByField = properties.ToDictionary(
            x => ToCamelCase(x.Name),
            x => new List<FieldValidationConstraintDto>());

        foreach (var property in properties)
        {
            var camelCaseName = ToCamelCase(property.Name);
            var fieldConstraints = constraintsByField[camelCaseName];

            if (property.PropertyType.Name.EndsWith("Dto"))
            {
                fieldConstraints.Add(
                    new FieldValidationConstraintDto(
                        ValidationConstraintType.ChildObject,
                        new ChildObjectConstraintDto(property.PropertyType.Name)));
                continue;
            }

            {
                var (isRequired, errorMessage) = (false, (string?)null);
                foreach (var attribute in property.GetCustomAttributes<RequiredAttribute>())
                {
                    isRequired = true;
                    errorMessage = attribute.ErrorMessage;
                }

                var nullabilityInfo = _nullabilityInfoContext.Create(property);
                if (nullabilityInfo.WriteState != NullabilityState.Nullable)
                {
                    isRequired = true;
                }

                // if (property.PropertyType.IsValueType)  // TODO: This also matches 'int?'
                // {
                //     isRequired = true;
                // }

                if (isRequired)
                {
                    fieldConstraints.Add(
                        new FieldValidationConstraintDto(
                            ValidationConstraintType.Required,
                            new RequiredConstraintDto(errorMessage)));
                }
            }

            foreach (var attribute in property.GetCustomAttributes<StringLengthAttribute>())
            {
                fieldConstraints.Add(
                    new FieldValidationConstraintDto(
                        ValidationConstraintType.StringLength,
                        new StringLengthConstraintDto(attribute.MinimumLength, attribute.MaximumLength, attribute.ErrorMessage)));
            }

            foreach (var attribute in property.GetCustomAttributes<RegularExpressionAttribute>())
            {
                if (attribute.ErrorMessage is null or "")
                {
                    throw new InvalidOperationException("The RegularExpressionAttribute does not have a error message set which is required");
                }

                fieldConstraints.Add(
                    new FieldValidationConstraintDto(
                        ValidationConstraintType.RegularExpression,
                        new RegularExpressionConstraintDto(Pattern: attribute.Pattern, ErrorMessage: attribute.ErrorMessage)));
            }

            foreach (var attribute in property.GetCustomAttributes<PasswordAttribute>())
            {
                fieldConstraints.Add(
                    new FieldValidationConstraintDto(
                        ValidationConstraintType.Password,
                        new PasswordConstraintDto(
                            RequiredLength: attribute.RequiredLength,
                            RequiredUniqueChars: attribute.RequiredUniqueChars,
                            RequireNonAlphanumeric: attribute.RequireNonAlphanumeric,
                            RequireLowercase: attribute.RequireLowercase,
                            RequireUppercase: attribute.RequireUppercase,
                            RequireDigit: attribute.RequireDigit)));
            }

            foreach (var attribute in property.GetCustomAttributes<RangeAttribute>())
            {
                fieldConstraints.Add(
                    new FieldValidationConstraintDto(
                        ValidationConstraintType.Range,
                        new RangeConstraintDto(attribute.Minimum, attribute.Maximum)));
            }
        }

        return new TypeConstraintsDto(Fields: constraintsByField.ToDictionary(x => x.Key, x => x.Value.ToArray()));
    }

    private static string ToCamelCase(string pascalCase)
    {
        var sb = new StringBuilder();
        sb.Append(pascalCase[0].ToString().ToLower());
        sb.Append(pascalCase[1..]);
        return sb.ToString();
    }
}
