/**
 * A generated module for Chat functions
 *
 * This module has been generated via dagger init and serves as a reference to
 * basic module structure as you get started with Dagger.
 *
 * Two functions have been pre-created. You can modify, delete, or add to them,
 * as needed. They demonstrate usage of arguments and return types using simple
 * echo and grep commands. The functions can be called from the dagger CLI or
 * from one of the SDKs.
 *
 * The first line in this comment block is a short description line and the
 * rest is a long description with more detail on the module's purpose or usage,
 * if appropriate. All modules should have a short description.
 */
import { dag, Directory, object, func, Container } from "@dagger.io/dagger"

@object()
export class Chat {
  /**
   * Build nodejs image with libraries
   */
  @func()
  buildImage(source: Directory): Container {
    return dag
      .container()
      .from("node:24.2")
      .withDirectory("/code", source)
      .withWorkdir("/code")
      .withExec(["npm", "install"])

  }
  /**
  * run unittest in the project
  */
  @func('test')
  async unittest(source: Directory): Promise<string> {
    return this
      .buildImage(source)
      .withExec(["npm", "run", "test"])
      .stdout()
  }
}
