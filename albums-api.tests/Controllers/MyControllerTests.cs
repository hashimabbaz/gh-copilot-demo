using System;
using System.IO;
using Xunit;
using UnsecureApp.Controllers;

namespace UnsecureApp.Controllers.Tests
{
    public class MyControllerTests
    {
        private readonly MyController _controller;

        public MyControllerTests()
        {
            _controller = new MyController();
        }

        [Fact]
        public void ReadFile_ValidFile_ReturnsContent()
        {
            // Arrange
            string tempFilePath = Path.GetTempFileName();
            string testContent = "Hello, World!";
            File.WriteAllText(tempFilePath, testContent);

            // Act
            string result = _controller.ReadFile(tempFilePath);

            // Assert
            Assert.Equal(testContent, result);

            // Cleanup
            File.Delete(tempFilePath);
        }

        [Fact]
        public void ReadFile_InvalidFile_ThrowsFileNotFoundException()
        {
            // Arrange
            string invalidPath = "nonexistentfile.txt";

            // Act & Assert
            Assert.Throws<FileNotFoundException>(() => _controller.ReadFile(invalidPath));
        }

        [Fact]
        public void ReadFile_EmptyFile_ReturnsNull()
        {
            // Arrange
            string tempFilePath = Path.GetTempFileName();
            // File is empty by default

            // Act
            string result = _controller.ReadFile(tempFilePath);

            // Assert
            Assert.Null(result);

            // Cleanup
            File.Delete(tempFilePath);
        }

        [Fact]
        public void GetObject_CallsMethod_NoExceptionThrown()
        {
            _controller.GetObject();
        }

        // Note: GetProduct method requires database setup and is vulnerable to SQL injection.
        // For proper testing, refactor to inject SqlConnection. Skipping for now.
        // [Fact]
        // public void GetProduct_ValidProduct_ReturnsProductId()
        // {
        //     // Requires mocking or real DB setup
        // }
    }
}