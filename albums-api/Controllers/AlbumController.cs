using albums_api.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace albums_api.Controllers
{
    [Route("albums")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        // GET: api/album
        [HttpGet]
        public IActionResult Get()
        {
            var albums = Album.GetAll();

            return Ok(albums);
        }

        // GET api/<AlbumController>/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var album = Album.GetAll().FirstOrDefault(a => a.Id == id);
            
            if (album == null)
            {
                return NotFound($"Album with ID {id} not found");
            }
            
            return Ok(album);
        }

        // function that sort albums by name, artist or genre
        [HttpGet("sorted")]
        public IActionResult GetSorted([FromQuery] string sortBy = "name", [FromQuery] bool ascending = true)
        {
            var albums = Album.GetAll();

            var sortedAlbums = sortBy.ToLower() switch
            {
                "name" or "title" => ascending
                    ? albums.OrderBy(a => a.Title).ToList()
                    : albums.OrderByDescending(a => a.Title).ToList(),

                "artist" => ascending
                    ? albums.OrderBy(a => a.Artist).ToList()
                    : albums.OrderByDescending(a => a.Artist).ToList(),

                "price" => ascending
                    ? albums.OrderBy(a => a.Price).ToList()
                    : albums.OrderByDescending(a => a.Price).ToList(),

                _ => albums // Return unsorted if invalid sortBy parameter
            };

            return Ok(sortedAlbums);
        }

    }
}
