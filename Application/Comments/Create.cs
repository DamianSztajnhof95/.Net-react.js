using Application.Errors;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
            public string Username { get; set; }
        }
        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<CommentDto> Handle(Command request,
                CancellationToken cancellationToken)
            {

                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if (activity == null)
                {
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Activity = "Not found" });
                }
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new Domain.Comment
                {
                    Author = user,
                    Activity = activity,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };

                activity.Comments.Add(comment);

                var succes = await _context.SaveChangesAsync() > 0;

                if (succes) return _mapper.Map<CommentDto>(comment);
                throw new Exception("Problem saving changes");
            }
        }
    }
}
