using CodeHollow.FeedReader;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace ProyectoWebAgro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> GetNews()
        {
            var url = "https://www.todoagro.com.ar/categoria/agricultura/feed/";
            var feed = await FeedReader.ReadAsync(url);

            var news = feed.Items.Select(item => new {
                Title = item.Title,
                Link = item.Link,
                Published = item.PublishingDate?.ToString("dd/MM/yyyy"),
                Summary = item.Description,
                Image = ExtractImageUrl(item.Description)
            }).ToList();

            return Ok(news);
        }

        private string ExtractImageUrl(string html)
        {
            var match = Regex.Match(html, "<img.+?src=[\"'](.+?)[\"'].*?>", RegexOptions.IgnoreCase);
            return match.Success ? match.Groups[1].Value : null;
        }

    }
}
