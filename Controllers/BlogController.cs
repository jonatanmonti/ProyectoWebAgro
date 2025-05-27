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

            var news = new List<object>();

            foreach (var item in feed.Items)
            {
                var image = await ExtractImageUrl(item.Description, item.Link);

                news.Add(new
                {
                    Title = item.Title,
                    Link = item.Link,
                    Published = item.PublishingDate?.ToString("dd/MM/yyyy"),
                    Summary = item.Description,
                    Image = image
                });
            }

            return Ok(news);
        }

        private async Task<string?> ExtractImageUrl(string html, string articleUrl)
        {
            // 1. Intentar extraer desde el <img> del description
            var match = Regex.Match(html, "<img.+?src=[\"'](.+?)[\"'].*?>", RegexOptions.IgnoreCase);
            if (match.Success)
                return match.Groups[1].Value;

            // 2. Si no hay imagen en el resumen, hacer scraping del link de la noticia
            try
            {
                var web = new HtmlAgilityPack.HtmlWeb();
                var doc = await web.LoadFromWebAsync(articleUrl);

                // Buscar imagen principal (generalmente en og:image o en el primer <img>)
                var metaImg = doc.DocumentNode.SelectSingleNode("//meta[@property='og:image']");
                if (metaImg != null)
                {
                    var content = metaImg.GetAttributeValue("content", null);
                    if (!string.IsNullOrEmpty(content))
                        return content;
                }

                // Si no hay og:image, buscar el primer <img>
                var firstImg = doc.DocumentNode.SelectSingleNode("//img");
                if (firstImg != null)
                {
                    var src = firstImg.GetAttributeValue("src", null);
                    if (!string.IsNullOrEmpty(src))
                        return src;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error scraping imagen: " + ex.Message);
            }

            return null;
        }

    }
}
