using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Validators
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T,String> Password<T>(
            this IRuleBuilder<T, string> rulebuilder)
        {
            var options = rulebuilder
                    .NotEmpty()
                    .MinimumLength(6).WithMessage("Password mus be at least 6 characters")
                    .Matches("[A-Z]").WithMessage("Password must contain 1 uppercase character")
                    .Matches("[a-z]").WithMessage("Password must contain 1 lowercase character")
                    .Matches("[0-9]").WithMessage("Password must contain 1 number")
                    .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain 1 non alphanumeric");
            return options;
        }
    }
}
