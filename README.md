# JavaScript Submodules

Reusable JavaScript code shared between my personal projects.

The repository is primarily used as a collection of shared code for my [Obsidian](https://obsidian.md/) plugins built with Svelte 5.

## Repository structure

The shared code is organized using Git submodules. Projects that use this repository include it as a submodule rather than copying the code directly.

Different branches of this repository track different sets of submodules. This allows a single repository to maintain several independent collections of reusable code while keeping each shared component in its own Git repository.

## Usage

Add this repository as a Git submodule to a project:

```bash
git submodule add -b svelte-obsidian https://github.com/farlenkov/javascript-submodules.git
```

After cloning a project that uses the repository as a submodule:

```bash
git submodule update --init --recursive
```

The appropriate branch can then be selected according to the set of shared components required by the project.

## License

This project is licensed under the GNU General Public License v3.0. See [LICENSE](LICENSE) for details.
