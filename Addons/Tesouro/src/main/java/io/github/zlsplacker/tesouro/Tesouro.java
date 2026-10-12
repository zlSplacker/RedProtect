package io.github.zlsplacker.tesouro;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.World;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.PluginCommand;
import org.bukkit.command.TabCompleter;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;

/**
 * /tesouro: leva o jogador ao mundo dos tesouros.
 *
 * <ul>
 *   <li>/tesouro — vai para o mundo dos tesouros (permissão tesouro.usar, liberada para todos)</li>
 *   <li>/tesouro definir — o ponto onde você está passa a ser a chegada (tesouro.admin)</li>
 *   <li>/tesouro &lt;jogador&gt; — manda outro jogador; serve no console e em blocos de comando (tesouro.admin)</li>
 *   <li>/tesouro recarregar — relê o config.yml (tesouro.admin)</li>
 * </ul>
 */
public final class Tesouro extends JavaPlugin implements CommandExecutor, TabCompleter {

    private static final String ADMIN = "tesouro.admin";

    @Override
    public void onEnable() {
        saveDefaultConfig();
        PluginCommand comando = getCommand("tesouro");
        if (comando != null) {
            comando.setExecutor(this);
            comando.setTabCompleter(this);
        }
        if (Bukkit.getWorld(nomeDoMundo()) == null) {
            getLogger().warning("O mundo \"" + nomeDoMundo() + "\" ainda não está carregado. "
                    + "Confira o nome em config.yml (mundo) ou carregue o mundo (ex.: /mv load " + nomeDoMundo() + ").");
        }
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 0) {
            if (!(sender instanceof Player)) {
                mensagem(sender, "so-jogador");
                return true;
            }
            if (!sender.hasPermission("tesouro.usar")) {
                mensagem(sender, "sem-permissao");
                return true;
            }
            levar((Player) sender, sender);
            return true;
        }

        if (!sender.hasPermission(ADMIN)) {
            mensagem(sender, "sem-permissao");
            return true;
        }
        String sub = args[0].toLowerCase(Locale.ROOT);
        if (sub.equals("definir")) {
            if (!(sender instanceof Player)) {
                mensagem(sender, "so-jogador");
                return true;
            }
            definir((Player) sender);
            return true;
        }
        if (sub.equals("recarregar")) {
            reloadConfig();
            mensagem(sender, "recarregado");
            return true;
        }
        Player alvo = Bukkit.getPlayerExact(args[0]);
        if (alvo == null) {
            mensagem(sender, "jogador-offline", "{jogador}", args[0]);
            return true;
        }
        if (levar(alvo, sender)) {
            mensagem(sender, "enviado", "{jogador}", alvo.getName());
        }
        return true;
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        if (args.length != 1 || !sender.hasPermission(ADMIN)) {
            return Collections.emptyList();
        }
        String inicio = args[0].toLowerCase(Locale.ROOT);
        List<String> opcoes = new ArrayList<>();
        for (String s : new String[]{"definir", "recarregar"}) {
            if (s.startsWith(inicio)) {
                opcoes.add(s);
            }
        }
        for (Player p : Bukkit.getOnlinePlayers()) {
            if (p.getName().toLowerCase(Locale.ROOT).startsWith(inicio)) {
                opcoes.add(p.getName());
            }
        }
        return opcoes;
    }

    /* ---------- teleporte ---------- */

    private String nomeDoMundo() {
        return getConfig().getString("mundo", "tesouro");
    }

    /** Chegada: o ponto salvo com /tesouro definir ou, se não houver, o spawn do mundo dos tesouros. */
    private Location destino() {
        World mundo = Bukkit.getWorld(nomeDoMundo());
        if (mundo == null) {
            return null;
        }
        FileConfiguration c = getConfig();
        if (c.getBoolean("local.definido", false)) {
            return new Location(mundo, c.getDouble("local.x"), c.getDouble("local.y"), c.getDouble("local.z"),
                    (float) c.getDouble("local.yaw"), (float) c.getDouble("local.pitch"));
        }
        Location spawn = mundo.getSpawnLocation();
        // o spawn do mundo vem no canto do bloco: o jogador chega no meio dele
        return new Location(mundo, spawn.getBlockX() + 0.5, spawn.getY(), spawn.getBlockZ() + 0.5, spawn.getYaw(), spawn.getPitch());
    }

    private boolean levar(Player jogador, CommandSender quemPediu) {
        Location chegada = destino();
        if (chegada == null) {
            mensagem(quemPediu, "mundo-nao-encontrado", "{mundo}", nomeDoMundo());
            getLogger().warning("/tesouro: o mundo \"" + nomeDoMundo() + "\" não está carregado.");
            return false;
        }
        if (!jogador.teleport(chegada)) {
            mensagem(quemPediu, "falhou");
            return false;
        }
        mensagem(jogador, "teleportado");
        return true;
    }

    private void definir(Player jogador) {
        Location l = jogador.getLocation();
        FileConfiguration c = getConfig();
        c.set("mundo", l.getWorld().getName());
        c.set("local.definido", true);
        c.set("local.x", l.getX());
        c.set("local.y", l.getY());
        c.set("local.z", l.getZ());
        c.set("local.yaw", (double) l.getYaw());
        c.set("local.pitch", (double) l.getPitch());
        saveConfig();
        mensagem(jogador, "definido", "{mundo}", l.getWorld().getName());
    }

    /* ---------- mensagens do config.yml, com cores & ---------- */

    private void mensagem(CommandSender para, String chave, String... trocas) {
        String texto = getConfig().getString("mensagens." + chave, "");
        if (texto.isEmpty()) {
            return;
        }
        for (int i = 0; i + 1 < trocas.length; i += 2) {
            texto = texto.replace(trocas[i], trocas[i + 1]);
        }
        para.sendMessage(ChatColor.translateAlternateColorCodes('&', getConfig().getString("prefixo", "") + texto));
    }
}
