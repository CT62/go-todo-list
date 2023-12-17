package main

import (
  "gorm.io/driver/sqlite"
  "gorm.io/gorm"

  "github.com/gofiber/fiber/v2"
  "github.com/gofiber/fiber/v2/middleware/cors"

  "log"
  "strconv"
)

type Todo struct {
	gorm.Model
        ID          uint
	Title       string `json:"title"`
	Done        bool   `json:"done"`
}

var db *gorm.DB

func CreateNewTodo(c *fiber.Ctx) error {
    var todo Todo

    c.BodyParser(&todo)
    db.Create(&Todo{Title:todo.Title,Done:todo.Done})
    return c.Status(fiber.StatusCreated).JSON(todo)
}

func GetAllTodos(c *fiber.Ctx) error {
    var todos []Todo

    db.Find(&todos)
    return c.JSON(todos)
}


func FinishTodo(c *fiber.Ctx) error {
    id := c.Params("id")
    var todo Todo

    idUint, err := strconv.ParseUint(id, 10, 64); if err != nil {
	    return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID format"})
    }
    todoID := uint(idUint)

    result := db.First(&todo, todoID)
    if result.Error != nil {
	    return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Todo not found"})
    }

    if result := db.Model(&todo).Update("done", !todo.Done); result.Error != nil {
	    return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
    }

    return c.JSON(todo)
}


func main() {
    app := fiber.New()
    app.Use(cors.New())
	
    var err error
    db, err = gorm.Open(sqlite.Open("todos.db"), &gorm.Config{})
    if err != nil{
        panic(err)
    }  

    db.AutoMigrate(&Todo{})

    app.Post("/todos", CreateNewTodo)
    app.Get("/todos", GetAllTodos)
    app.Post("/todos/:id/finish",FinishTodo)

    log.Fatal(app.Listen(":3000"))
}
