# Use the official .NET 8 runtime image as the base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the official .NET 8 SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["albums-api.csproj", "."]
RUN dotnet restore "albums-api.csproj"

# Copy the rest of the source code
COPY . .

# Build the application
RUN dotnet build "albums-api.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "albums-api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Create the final runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "albums-api.dll"]