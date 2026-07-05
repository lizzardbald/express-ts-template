# express-ts-template

## Descritpion

Express js project template with TypeScript.
If you like this template, give it a ⭐

### Note

This project uses sequalize as ORM. If you are more familiar with prisma, checkout main-prisma branch.

## How to run

If you want to use this project template you can run:

1. run `git clone https://github.com/radnaxel-a/express-ts-template.git`
2. run `cd express-ts-example`
3. run `npm i`
4. run `rm -rf .git` or delete the `.git` folder to remove the repo link
5. run `npm run dev` to compile and run
6. open your browser at `localhost:8080`

## Adding more controllers

1. Create your controller in the `src/app/controllers/` folder.
2. Extend the `Controller` abstract class and implement it. This will give you the opportunity to use basic CRUD operations.

```
export abstract class Controller implements IController {
    public path: string;

    constructor(_path: string) {
        this.path = _path;
    }

    abstract get(request: Request, response: Response): void
    abstract post(request: Request, response: Response): void;
    abstract put(request: Request, response: Response): void;
    abstract delete(request: Request, response: Response): void;
}
```

You can write your business logic in the child classes as you would in a normal express js callback:

```
export class UsersController extends Controller {
    /**
     * Set the route for this controller in super()
     */
    constructor() {
        super(Routes.Users);
    }

    public [Method.GET](request: Request, response: Response): void {
        response.send('users get');
    }

    public [Method.POST](request: Request, response: Response): void {
        response.send('users post ' + request.params.uid);
    }

    public [Method.PUT](request: Request, response: Response): void {
        response.send('users put ' + request.params.uid);
    }

    public [Method.DELETE](request: Request, response: Response): void {
        response.send('users delete ' + request.params.uid);
    }
}
```

3. Add your controller route in the `Route.ts` file under `src/app/config/Routes.ts`

```
export enum Routes {
    Users = 'users'
}
```

4. Pass your controller route to the `super` function.

```
export class UsersController extends Controller {
    /**
     * Set the route for this controller in super()
     */
    constructor() {
        super(Routes.Users);
    }
```

5. Add your a referance to your controller types in the `Controllers.ts` file under `src/utils/Controllers.ts`. As long as the controllers are listed there, the routes will be added to express.

```
export class Controllers {
    /**
     * Add type referance to controllers here
     */
    protected controllers: Constructable<Controller>[] = [
        UsersController,
    ];

    public create(): Controller[] {
        return this.controllers.map((c) => new c());
    }
}
```

In the `UsersController` is left as an example to you how to do it.

## Routes

The routes are created in the main class under `src/main.ts`.

```
 private createControllers(): void {
        const controllers = new Controllers().create();

        for (const ctrl of controllers) {
            this.express[Method.GET](`/${ctrl.path}`, ctrl[Method.GET]);
            this.express[Method.POST](`/${ctrl.path}/:uid`, ctrl[Method.POST]);
            this.express[Method.PUT](`/${ctrl.path}/:uid`, ctrl[Method.PUT]);
            this.express[Method.DELETE](`/${ctrl.path}/:uid`, ctrl[Method.DELETE]);
        }
    }
```

If you wish to have other methods added, they can be added in the `Method` enum file.
