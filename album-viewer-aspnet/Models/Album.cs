namespace album_viewer_aspnet.Models
{
    public record Album(int Id, string Title, string Artist, int Year, double Price, string Image_url);
}